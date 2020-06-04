var gitlog = require('../').gitlog
	, exec = require('child_process').exec
	, testRepoLocation = __dirname + '/test-repo-clone'
	, gitVer = '1.0.0'

function execInTestDir(command, cb) {
	exec(command, { cwd: __dirname },  cb)
}

exec('git --version', function(stderr, stdout) {
	if (!stderr){
		// Slice version number from returned string
		gitVer = stdout.split('git version')[1].trim().slice(0, 5)

		// Only care about major/minor/build, any more and semver will error
		gitVer = gitVer.split('.').slice(0, 3).join('.')
	}
})

describe('gitlog', function() {

	beforeEach(function(done) {
		execInTestDir(__dirname + '/delete-repo.sh', function(error) {
			if (error) {
				return done(error)
			}
			execInTestDir(__dirname + '/create-repo.sh', done)
		})
	})

	it('throws an error when repo is not provided', function() {
		(function() {
			gitlog({}, function() {})
		}).should.throw('Repo required!')
	})

	it('throws an error when repo location does not exist', function() {
		(function() {
			gitlog({ repo: 'wrong directory' }, function() {})
		}).should.throw('Repo location does not exist')
	})

	it('throws an error when an unknown field is used', function() {
		var field = 'fake-field'
		;(function() {
			gitlog({ repo: testRepoLocation, fields: [ field ] }, function() {})
		}).should.throw('Unknown field: ' + field)
	})

	it('returns 21 commits from specified branch', function(done) {
		gitlog({ repo: testRepoLocation, branch: 'new-branch', number: 100 }, function(err, commits) {
			commits.length.should.equal(21)
			done()
		})
	})

	it('returns 1 commit from specified revision range', function(done) {
		gitlog({ repo: testRepoLocation, branch: 'master..new-branch', number: 100 }, function(err, commits) {
			commits.length.should.equal(1)
			commits[0].subject.should.equal('Added new file on new branch')
			done()
		})
	})

	it('returns 22 commits from repository with all=false', function(done) {
		gitlog({ repo: testRepoLocation, all: false, number: 100 }, function(err, commits) {
			commits.length.should.equal(22)
			done()
		})
	})

	it('returns 23 commits from repository with all=true', function(done) {
		gitlog({ repo: testRepoLocation, all: true, number: 100 }, function(err, commits) {
			commits.length.should.equal(23)
			done()
		})
	})

	it('defaults to 10 commits', function(done) {
		gitlog({ repo: testRepoLocation }, function(err, commits) {
			commits.length.should.equal(10)

			done()
		})
	})

	it('returns 10 commits from other dir, execOptions specified', function(done) {
		var cwd = process.cwd()
		process.chdir('/tmp')
		gitlog({ repo: testRepoLocation, execOptions: { encoding: 'utf8' } }, function(err, commits) {
			commits.length.should.equal(10)
			done()
		})
		process.chdir(cwd)
	})

	it('returns 10 commits from other dir', function(done) {
		var cwd = process.cwd()
		process.chdir('/tmp')
		gitlog({ repo: testRepoLocation }, function(err, commits) {
			commits.length.should.equal(10)
			done()
		})
		process.chdir(cwd)
	})

	it('returns the fields requested', function(done) {
		var fields =
			[ 'hash'
				, 'abbrevHash'
				, 'treeHash'
				, 'authorName'
				, 'authorEmail'
				, 'tags'
			]

		gitlog({ repo: testRepoLocation, fields: fields, nameStatus: false }, function(err, commits) {
			commits[0].should.be.an.Object
			commits[0].should.have.properties(fields)

			done()
		})
	})

	it('returns tags correctly', function(done) {
		var fields =
			[ 'hash'
				, 'abbrevHash'
				, 'treeHash'
				, 'authorName'
				, 'authorEmail'
				, 'tags'
			]

		gitlog({ repo: testRepoLocation, fields: fields, nameStatus: false }, function(err, commits) {
			commits[0].tags.length.should.equal(0)
			commits[1].tags.length.should.equal(1)
			commits[1].tags[0].should.equal('v1.2.3')

			done()
		})
	})

	it('returns a default set of fields', function(done) {
		var defaults = [ 'abbrevHash', 'hash', 'subject', 'authorName' ]

		gitlog({ repo: testRepoLocation, nameStatus: false }, function(err, commits) {
			commits[0].should.have.properties(defaults)

			done()
		})
	})

	it('returns nameStatus fields', function(done) {
		var defaults = [ 'abbrevHash', 'hash', 'subject', 'authorName', 'status', 'files' ]

		gitlog({ repo: testRepoLocation }, function(err, commits) {
			commits[0].should.have.properties(defaults)

			done()
		})
	})

	it('returns fields with "since" limit', function(done) {

		gitlog({ repo: testRepoLocation, since: '1 minutes ago' }, function(err, commits) {
			commits.length.should.equal(10)

			done()
		})
	})

	it('returns fields with "after" limit', function(done) {

		gitlog({ repo: testRepoLocation, after: '1 minutes ago' }, function(err, commits) {
			commits.length.should.equal(10)

			done()
		})
	})

	it('returns fields with "before" limit', function(done) {

		gitlog({ repo: testRepoLocation, before: '2001-12-01' }, function(err, commits) {
			commits.length.should.equal(0)

			done()
		})
	})

	it('returns fields with "until" limit', function(done) {

		gitlog({ repo: testRepoLocation, until: '2001-12-01' }, function(err, commits) {
			commits.length.should.equal(0)

			done()
		})
	})

	it('returns commits only by author', function(done) {
		var defaults = [ 'authorName' ]
			,  command = 'cd ' + testRepoLocation + ' ' +
			'&& touch new-file ' +
			'&& git add new-file ' +
			'&& git commit -m "New commit" ' +
			'--author="A U Thor <author@example.com>"'

			, author = 'Dom Harrington'

		// Adding a new commit by different author
		exec(command, function() {
			gitlog({ repo: testRepoLocation, author: author, fields: defaults }, function(err, commits) {

				commits.forEach(function(commit) {
					commit.authorName.should.equal(author)
				})

				done()
			})
		})
	})

	it('returns commits only by committer', function(done) {
		var defaults = [ 'committerName' ]
			, command = 'cd ' + testRepoLocation + ' ' +
			'&& touch new-file ' +
			'&& git add new-file ' +
			'&& git commit -m "New commit" ' +
			'--committer="A U Thor <author@example.com>"'

			, committer = 'Dom Harrington'

		// Adding a new commit by different author
		exec(command, function() {
			gitlog({ repo: testRepoLocation, committer: committer, fields: defaults }, function(err, commits) {

				commits.forEach(function(commit) {
					commit.committerName.should.equal(committer)
				})

				done()
			})
		})
	})

	it('returns A status for files that are added', function(done) {
		gitlog({ repo: testRepoLocation }, function(err, commits) {
			commits[1].status[0].should.equal('A')
			done()
		})
	})

	it('returns C100 status for files that are copied', function(done) {
		gitlog({ repo: testRepoLocation, findCopiesHarder: true }, function(err, commits) {
			commits[1].status[0].should.equal('C100')
			done()
		})
	})

	it('returns M status for files that are modified', function(done) {
		gitlog({ repo: testRepoLocation }, function(err, commits) {
			commits[3].status[0].should.equal('M')
			done()
		})
	})

	it('returns D status for files that are deleted', function(done) {
		gitlog({ repo: testRepoLocation }, function(err, commits) {
			commits[4].status[0].should.equal('D')
			done()
		})
	})

	it('returns author name correctly', function(done) {
		// check the author name of all commits
		gitlog({ repo: testRepoLocation }, function(err, commits) {

			commits.forEach(function(commit) {
				commit.authorName.should.equal('Your Name');
			})

			done()
		})
	})

	// This fails inconsistently on different versions of git
	// https://github.com/domharrington/node-gitlog/issues/24
	//
	// it('returns R100 & D status for files that are renamed (100 is % of similarity) or A', function(done) {
	//   gitlog({ repo: testRepoLocation, number: 100 }, function(err, commits) {
	//     if (semver.gte(gitVer, '2.0.0')){
	//       commits[5].status[0].should.equal('R100')
	//       commits[5].status[1].should.equal('D')
	//     } else {
	//       commits[5].status[0].should.equal('A')
	//     }
	//     done()
	//   })
	// })

	it('returns synchronously if no callback is provided', function () {
		var commits = gitlog({ repo: testRepoLocation })
		commits.length.should.equal(10)
	})

	it('should allow both body and rawBody', function (done) {
		var fields = ['body', 'rawBody'];
		gitlog({ repo: testRepoLocation, number: 1, fields: fields }, function(err, commits) {
			commits[0].should.have.properties(fields)
			done()
		})
	})

	after(function(done) {
		execInTestDir(__dirname + '/delete-repo.sh', function() {
			done()
		})
	})

})

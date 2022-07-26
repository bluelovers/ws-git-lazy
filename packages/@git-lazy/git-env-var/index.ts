/**
 * @see https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables
 */
export interface IGitEnv
{
	// Global Behavior

	GIT_EXEC_PATH?: string
	HOME?: string
	PREFIX?: string
	GIT_CONFIG_NOSYSTEM?: string
	GIT_PAGER?: string
	GIT_EDITOR?: string

	// Repository Locations

	/**
	 * GIT_DIR is the location of the .git folder. If this isn’t specified, Git walks up the directory tree until it gets to ~ or /, looking for a .git directory at every step.
	 */
	GIT_DIR?: string
	GIT_CEILING_DIRECTORIES?: string
	GIT_WORK_TREE?: string
	GIT_INDEX_FILE?: string
	GIT_OBJECT_DIRECTORY?: string
	GIT_ALTERNATE_OBJECT_DIRECTORIES?: string

	// Pathspecs

	GIT_GLOB_PATHSPECS?: string
	GIT_NOGLOB_PATHSPEC?: string
	GIT_LITERAL_PATHSPECS?: string
	GIT_ICASE_PATHSPECS?: string

	// Committing

	GIT_AUTHOR_NAME?: string
	GIT_AUTHOR_EMAIL?: string
	GIT_AUTHOR_DATE?: string
	GIT_COMMITTER_NAME?: string
	GIT_COMMITTER_EMAIL?: string
	GIT_COMMITTER_DATE?: string
	EMAIL?: string

	// Networking

	GIT_CURL_VERBOSE?: string
	GIT_SSL_NO_VERIFY?: string
	GIT_HTTP_LOW_SPEED_LIMIT?: string
	GIT_HTTP_LOW_SPEED_TIME?: string
	GIT_HTTP_USER_AGENT?: string

	// Diffing and Merging

	GIT_DIFF_OPTS?: string
	GIT_EXTERNAL_DIFF?: string
	GIT_DIFF_PATH_COUNTER?: string
	GIT_DIFF_PATH_TOTAL?: string
	GIT_MERGE_VERBOSITY?: string

	// Debugging

	GIT_TRACE?: string
	GIT_TRACE_PACK_ACCESS?: string
	GIT_TRACE_PACKET?: string
	GIT_TRACE_PERFORMANCE?: string
	GIT_TRACE_SETUP?: string

	// Miscellaneous

	GIT_SSH?: string
	GIT_ASKPASS?: string
	GIT_NAMESPACE?: string
	GIT_FLUSH?: string
	GIT_REFLOG_ACTION?: string
}

declare global
{
	namespace NodeJS
	{
		interface ProcessEnv extends IGitEnv
		{

		}
	}
}

export function getGitEnv(key: keyof IGitEnv, env?: Record<string, string>)
{
	return (env ?? process.env)[key]
}

export default getGitEnv

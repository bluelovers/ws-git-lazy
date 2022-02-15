
/**
 * 防止 git ENOBUFS 錯誤
 * https://www.cxyzjd.com/article/F_Origin/108589968
 */
export const GitExecMaxBuffer = 1024 * 1024 * 100;

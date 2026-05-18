import multer from 'multer'

// Store files in memory so we can forward the buffer to Azure
// Max file size: 50 MB (for class materials, assignments, submissions, etc.)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
})

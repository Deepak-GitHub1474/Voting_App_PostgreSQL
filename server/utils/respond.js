const ok = (res, message, data = null, status = 200) => res.status(status).json({ success: true, message, data });

const fail = (res, status, message, data = null) => res.status(status).json({ success: false, message, data });

module.exports = { ok, fail };

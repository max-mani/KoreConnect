import jsonwebtoken from "jsonwebtoken";

const verifyToken = (roles = []) => (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export default verifyToken;

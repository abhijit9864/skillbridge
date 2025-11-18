const checkAdminRole = (req, res, next) => {
    const { role } = req.user; // Assuming role is set in JWT token
    
    if (role !== "System Administrator" && role !== "Organization Administrator") {
      return res.status(403).json({ message: "Access Denied. Only admins can assign courses." });
    }
  
    next();
  };
  
  module.exports = { checkAdminRole };
  
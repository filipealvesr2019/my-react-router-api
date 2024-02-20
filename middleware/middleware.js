const addUserDataToRequest = (req, res, next) => {
    // Aqui você pode adicionar as informações do usuário ao objeto req
    // Por exemplo, você pode adicionar o papel do usuário ao objeto req.user
    req.user = {
      role: 'administrador', // Adicione o papel do usuário aqui
    };
  
    // Chame o próximo middleware na cadeia
    next();
  };
  
  const checkPermissions = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user ? req.user.role : null;
  
      console.log('Papel do usuário:', userRole);
      console.log('Papéis permitidos:', allowedRoles);
  
      if (!userRole) {
        console.log('Token inválido ou ausente. Permissão negada.');
        return res.status(401).json({ message: "Token inválido ou ausente." });
      }
  
      if (allowedRoles.includes(userRole)) {
        console.log('Permissão concedida. Continuando para a próxima função.');
        next();
      } else {
        console.log('Permissão negada. Papel do usuário não autorizado.');
        return res.status(403).json({ message: "Permissão negada." });
      }
    };
  };
  
  module.exports = { addUserDataToRequest, checkPermissions };
  
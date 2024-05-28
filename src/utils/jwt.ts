export const jwtConfig = {
  secret: "chavesecreta", // Você deve usar uma chave secreta forte
  signOptions: {
    expiresIn: "1h", // Tempo de expiração do token
  },
};

import nodemailer from 'nodemailer';


const emailRegistro = async(datos)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });

      const {email,nombre,token } = datos;

      await transport.sendMail({
        from: 'bienesraices.com',
        to: email,
        subject: 'Confirma tu cuenta en bienesraices.com',
        text: 'Confirma tu cuenta',
        html: `
        <p>Hola ${nombre}</p>
        <p>Confirma tu cuenta en bienesraices.com</p>
        <p>Si no has creado una cuenta, puedes ignorar este email</p>
        <p>Para confirmar tu cuenta, haz click en el siguiente enlace</p>
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 8080}/auth/confirmar/${token}">Confirmar Cuenta</a>`,

    }   )
}

const olvidemiPassword = async(datos)=>{
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const {email,nombre,token } = datos;

    await transport.sendMail({
      from: 'bienesraices.com',
      to: email,
      subject: 'Restablece tu cuenta en bienesraices.com',
      text: 'Restablece tu cuenta',
      html: `
      <p>Hola ${nombre}</p>
      <p>Has solicitado restablecer tu password en Bienecesraices.com</p>
      <p>Si no has creado una cuenta, puedes ignorar este email</p>
      <p>Para generar un nuevo password, haz click en el siguiente enlace</p>
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 8080}/auth/olvidepassword/${token}">Restablecer password</a>`,


  }   )
}


export {
    emailRegistro,
    olvidemiPassword
}
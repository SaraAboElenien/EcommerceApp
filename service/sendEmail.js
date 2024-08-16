import { createTransport } from "nodemailer";



export const sendEmail = async (to, subject, html ) => {
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: "sm5108940@gmail.com",
            pass: "mbjsoeevuccqzqwq",
        },
    });

    const info = await transporter.sendMail({
        from: '"welcome 👻" <sm5108940@gmail.com>',
        to: to? to:"" ,
        subject:subject? subject: "HelloHelloHello",
        // text: "Hello world?",
        html: html? html: "HelloHelloHello",
    });
    console.log(info);
    if (info.accepted.length) {
        return true;
    } else {
        return false;
    }

}
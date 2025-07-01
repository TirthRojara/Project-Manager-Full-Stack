
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sending_email = process.env.EMAIL_FOR_SENDING

// sgMail.send({
//         to: 'tirth744clg@gmail.com',
//         from: 'work.tirthrojara@gmail.com',
//         subject: 'First email from node.js',
//         text: 'I hopre this one actually get to you.'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({

        to: email,
        from: sending_email,
        subject: 'Welcome to task manager.',
        text: `Welcome to the app, ${name}, Let me know how you get along with the app.`

    })
    console.log('Email sended')
}

// const sendCancelationEmail = async (email, name) => {
const sendCancelationEmail = (email, name) => {
    //  await sgMail.send({
    sgMail.send({

        to: email,
        from: sending_email,
        subject: '😒Sorry to see you go!',
        text: `Miss you ${name}. I hope to see you soon.`

    })
    console.log('Email sended')
}


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}

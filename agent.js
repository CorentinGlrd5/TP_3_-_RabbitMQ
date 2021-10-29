const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'transactions';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [SMS] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            let message = JSON.parse(msg.content.toString()).amount;
            if (message >= 0) {
                console.log(" [SMS] Received %s", msg.content.toString());
            }
        }, {
            noAck: true
        });
        // sendNotificationSMS(error0, connection);
        // sendNotificationMail(error0, connection);
    });
});

// async function sendNotificationSMS(error0, connection){
//     setInterval(async () => {
//         let accountIndex = Math.floor(Math.random() * 99);
//         let amount = Math.floor(Math.random() * (10000 +2 +1));
//         let tel = "+33 6 42 59 96 52";
//         let sms = {
//             message : "Bonjour John Doe, votre paiement de" + amount + "a bien été effectué",
//             account_id :accounts[accountIndex].account_id,
//             mail : "john.doe@gmail.com",
//             tel : tel
//         }

//         // Appel de l'agent pour le traitement de la sms
//             if (error0) {
//                 throw error0;
//             }
//             connection.createChannel(function(error1, channel) {
//                 if (error1) {
//                 throw error1;
//                 }
//                 var queue = "notifications_sms";
//                 var msg = JSON.stringify(sms);

//                 channel.assertQueue(queue, {
//                 durable: false
//                 });

//                 channel.sendToQueue(queue, Buffer.from(msg));
//                 console.log(" [SMS] SMS envoyé au " + tel + "avec succès");
//             });
//             setTimeout(function() {
//                 connection.close();
//                 process.exit(0)
//                 }, 500);
//         });
// }

// async function sendNotificationMail(error0, connection){
//     setInterval(async () => {
//         let accountIndex = Math.floor(Math.random() * 99);
//         let amount = Math.floor(Math.random() * (10000 +2 +1));
//         let tel = "+33 6 42 59 96 52";
//         let mail = "john.doe@gmail.com";
//         let notificationMail = {
//             message : "Bonjour John Doe, votre paiement de" + amount + "a bien été effectué",
//             account_id :accounts[accountIndex].account_id,
//             mail : mail,
//             tel : tel
//         }

//         // Appel de l'agent pour le traitement de la mail
//         amqp.connect('amqp://localhost', function(error0, connection) {
//             if (error0) {
//                 throw error0;
//             }
//             connection.createChannel(function(error1, channel) {
//                 if (error1) {
//                 throw error1;
//                 }
//                 var queue = "notifications_sms";
//                 var msg = JSON.stringify(notificationMail);

//                 channel.assertQueue(queue, {
//                 durable: false
//                 });

//                 channel.sendToQueue(queue, Buffer.from(msg));
//                 console.log(" [MAIL] MAIL envoyé au " + mail + "avec succès");
//             });
//             setTimeout(function() {
//                 connection.close();
//                 process.exit(0)
//                 }, 500);
//         });
//     } , delay)
// }
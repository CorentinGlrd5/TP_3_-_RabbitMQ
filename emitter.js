const { fork } = require('child_process');
const accounts  = require('./accounts.json');
const {
    v4: uuidv4,
} = require('uuid');


let delay = process.argv[2] || 100
const amqp = require('amqplib/callback_api');

async function start(){
    setInterval(async () => {
        let isCorrupted = Math.random() < 0.1;
        let accountIndex = Math.floor(Math.random() * 99)
        let transaction = {
            account_num :accounts[accountIndex].account_id,
            timestamp : Date.now(),
            transactionId : uuidv4(),
            amount : isCorrupted ? -1 : Math.floor(Math.random() * (10000 +2 +1)) -2
        }

        // Appel de l'agent pour le traitement de la transaction
        amqp.connect('amqp://localhost', function(error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function(error1, channel) {
                if (error1) {
                throw error1;
                }
                var queue = "transactions";
                var msg = JSON.stringify(transaction);

                channel.assertQueue(queue, {
                durable: false
                });

                channel.sendToQueue(queue, Buffer.from(msg));
                console.log(" [EMITTER] Transaction n°${transaction.transactionId} : Sent %s", msg);
            });
            setTimeout(function() {
                connection.close();
                process.exit(0)
                }, 500);
        });
    } , delay)
}

start();

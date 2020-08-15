const tmi = require('tmi.js');
const fs = require('fs');

//Channel that the bot will connect
let channel = '--channel--';

const options = {
    options: {
        debug: true,
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        //Username of the bot account
        username: 'The_Bot',
        //Log in the bot account and generate a password in this link
        //https://twitchapps.com/tmi/
        password: '--password--'
    },
    channels: [channel],
};


const client =  new tmi.client(options);

//File were the deathcounter will be written
const fileName = 'deathcount'
//Start value of the deathcounter
let deathcount = 0;

/* COMMANDS */
//Command that add a death
const addDeath = 'addDeath';
//Command that decrement a death
const decDeath = 'decDeath';
//Command that restthe death counter
const resetDeath = 'resetDeath';
//Command that set the death counter to a specif value
const setDeath = 'setDeath';

//Check if the deathcounter file already exists
try {
    if(fs.existsSync(`./${fileName}.txt`)){
        fs.readFile(`./${fileName}.txt`,'utf8', function(err, data) {
            if(err) {}
            deathcount = data;
        });
    }
} catch(err) {

}

client.connect();

client.on('connected', (address, port) => {
    client.action(channel, 'Hello');
});

client.on('chat', (channel, user, message, self) => {
    //message = message.toLowerCase();
    const args = message.slice(1).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd  ==  addDeath) {//ADD DEATH
        deathcount++;
        updateFile(deathcount);
    } else if (cmd == decDeath) {//DECREMENT DEATH
        deathcount--;
        updateFile(deathcount);
    } else if (cmd == resetDeath) {//RESET DEATH
        deathcount = 0;
        updateFile(deathcount);
    } else if (cmd == setDeath && args.length > 0) {//SET DEATH
        if(args[0] > 0) {
            deathcount = args[0];
        }
        updateFile(deathcount);
    }
})

function updateFile(deathcount) {
    fs.writeFile(`${fileName}.txt`,`${deathcount}`,function(err){
        if(err) throw err;
    });
}
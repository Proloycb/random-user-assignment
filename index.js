const express = require('express')
const fs = require('fs')
const { getUserData, saveUserData } = require('./utils')

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());



// get random user
app.get('/user/random', (req, res) => {
    const users = getUserData()
    const randomUser = users[Math.floor(Math.random() * users.length)]
    res.send(randomUser)
});

// get user by id
app.get('/user/random/:id', (req, res) => {
    const users = getUserData()
    const user = users.find(user => user.id === req.params.id)
    if (user) {
        res.send(user)
    } else {
        res.status(404).send({ error: true, msg: 'User not found' })
    }
});

// get all user
app.get('/user/all', (req, res) => {
    const limit = req.query.limit
    const users = getUserData()

    if (limit) {
        const limitedUsers = users.slice(0, limit)
        res.send(limitedUsers)
    } else {
        res.send(users)
    }
});

// post user data
app.post('/user/save', (req, res) => {
    //get the existing user data
    const existingUsers = getUserData();
    const userData = req.body;
    //check if the userData fields are missing
    if (userData.name == null || userData.gender == null || userData.contact == null || userData.address == null || userData.photoUrl == null) {
        return res.status(401).send({ error: true, msg: 'Some User information missing' })
    }
    // generate id and add in user data
    const randomId = '#' + Math.floor(Math.random() * 16777215).toString(16);
    userData.id = randomId

    //append the user data
    existingUsers.push(userData)
    //save the new user data
    saveUserData(existingUsers);
    res.send({ success: true, msg: 'User data added successfully' })
});

// // Update a user's information
app.patch('/user/update/:id', (req, res) => {
    const id = req.params.id;
    const userData = req.body;
    //get the existing user data
    const existingUsers = getUserData();
    //check if the user id exist or not       
    let updatedUser = existingUsers.find(user => user.id === id)
    if (!updatedUser) {
        return res.status(409).send({ error: true, msg: 'user not exist' })
    }
    //filter the userdata
    const nonUpdatedUser = existingUsers.filter(user => user.id !== id)


    //push the updated data
    for (const key in updatedUser) {
        if (userData[key]) {
            updatedUser[key] = userData[key]
        } else {
            updatedUser = { ...updatedUser, ...userData } // this line makes the put req to patch
        }
    }
    nonUpdatedUser.push(updatedUser)
    //finally save it
    saveUserData(nonUpdatedUser)
    res.send({ success: true, msg: 'User data updated successfully' })
});


// // update multiple user's information
app.patch('/user/bulk-update', (req, res) => {

    const reqBody = req.body;
    const splittedReqBodyObj = Object.entries(reqBody)
    const idsArray = splittedReqBodyObj[0][1]
    const dataUpdateArray = splittedReqBodyObj.slice(1)

    const dataUpdateObj = Object.fromEntries(dataUpdateArray)

    const existingUsers = getUserData()

    const findRequiredUsers = existingUsers.filter(element => idsArray.includes(element.id));
    if (findRequiredUsers.length !== idsArray.length) {
        return res.status(409).send({ error: true, msg: 'user not exist' })
    }

    const nonUpdatedUsers = existingUsers.filter(user => !idsArray.includes(user.id))

    let theUpdatedUsers = []
    for (let theUser2update of findRequiredUsers) {
        for (const key in theUser2update) {
            if (dataUpdateObj[key]) {
                theUser2update[key] = dataUpdateObj[key]
            } else {
                theUser2update = { ...theUser2update, ...dataUpdateObj } // this line makes the put req to patch
            }
        }
        theUpdatedUsers.push(theUser2update)
    }

    const allMergedUsers = [...nonUpdatedUsers, ...theUpdatedUsers]
    saveUserData(allMergedUsers)
    res.send({ success: true, msg: 'User data updated successfully' })

})



// // Delete a user's information
app.delete('/user/delete/:id', (req, res) => {
    const id = req.params.id;
    //get the existing user data
    const existingUsers = getUserData();
    //check if the user id exist or not
    const findExist = existingUsers.find(user => user.id === id)
    if (!findExist) {
        return res.status(409).send({ error: true, msg: 'user not exist' })
    }
    //filter the userdata
    const nonDeletedUser = existingUsers.filter(user => user.id !== id)
    //finally save it
    saveUserData(nonDeletedUser)
    res.send({ success: true, msg: 'User data deleted successfully' })
})



app.get('/', (req, res) => {
    res.send('Random user assignment')
})

// Not found route
app.all("*", (req, res) => {
    res.send("NO route found.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
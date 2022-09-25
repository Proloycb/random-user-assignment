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
})

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
})

// /* Create - POST method */
// app.post('/user/save', (req, res) => {
//     //get the existing user data
//     const existingUsers = getUserData()

//     //get the new user data from post request
//     const userData = req.body
//     //check if the userData fields are missing
//     if (userData.gender == null || userData.name == null || userData.contact == null || userData.address == null || userData.photoUrl == null) {
//         return res.status(401).send({ error: true, msg: 'Some User iformation missing' })
//     }

//     // generate id and add in user data
//     const randomId = '#' + Math.floor(Math.random() * 16777215).toString(16);
//     userData.id = randomId

//     //append the user data
//     existingUsers.push(userData)
//     //save the new user data
//     saveUserData(existingUsers);
//     res.send({ success: true, msg: 'User data added successfully' })
// })





// // Update a user's information in the .json file using its id
// app.patch('/user/update/:id', (req, res) => {
//     //get the id from url
//     const id = req.params.id
//     //get the update data
//     const userData = req.body
//     //get the existing user data
//     const existingUsers = getUserData()
//     //check if the user id exist or not       
//     let theUser2update = existingUsers.find(user => user.id === id)
//     if (!theUser2update) {
//         return res.status(409).send({ error: true, msg: 'user not exist' })
//     }
//     //filter the userdata
//     const nonUpdatedUser = existingUsers.filter(user => user.id !== id)


//     //push the updated data
//     for (const key in theUser2update) {
//         if (userData[key]) {
//             theUser2update[key] = userData[key]
//         } else {
//             theUser2update = { ...theUser2update, ...userData } // this line makes the put req to patch
//         }
//     }
//     nonUpdatedUser.push(theUser2update)
//     //finally save it
//     saveUserData(nonUpdatedUser)
//     res.send({ success: true, msg: 'User data updated successfully' })
// })


// // update mulit user's information by update many
// app.patch('/user/bulk-update', (req, res) => {

//     //  req.body থেকে reqBody Obj কে নিব যেখানে প্রথম keyতে idsArray আছে আর বাকি গুলা হচ্ছে data4updateArray
//     const reqBody = req.body
//     const splittedReqBodyObj = Object.entries(reqBody)
//     const idsArray = splittedReqBodyObj[0][1]
//     const data4updateArray = splittedReqBodyObj.slice(1)

//     // এবার data4updateArray কে data4updateObj বানাবো
//     const data4updateObj = Object.fromEntries(data4updateArray)

//     // এবার database থেকে existingUsers নিয়ে আসব
//     const existingUsers = getUserData()

//     // এবার existingUsers থেকে idsArray এর সাথে মিলে যাওয়া findRequiredUsers গুলাকে নিয়ে আসব
//     const findRequiredUsers = existingUsers.filter(element => idsArray.includes(element.id));
//     if (findRequiredUsers.length !== idsArray.length) {
//         return res.status(409).send({ error: true, msg: 'user not exist' })
//     }


//     // এবার existingUsers থেকে idsArray এর সাথে না মিলে যাওয়া nonUpdatedUsers গুলাকে নিয়ে আসব
//     const nonUpdatedUsers = existingUsers.filter(user => !idsArray.includes(user.id))


//     // এবার findRequiredUsers এর উপরে forOf loop চালিয়ে তার ভিতরে individual theUser2update এর উপড়ে forIn loop চালিয়ে তার ভিতরে individual key গুলার সাথে data4updateObj এর সাথে মিলে যাওয়া key গুলার value আপডেট করব আর যেই যেই key গুলা না মিলে তাদেরকে theUser2update এর সাথে মার্জ করে theUpdatedUsers এ push করব
//     let theUpdatedUsers = []
//     for (let theUser2update of findRequiredUsers) {
//         for (const key in theUser2update) {
//             if (data4updateObj[key]) {
//                 theUser2update[key] = data4updateObj[key]
//             } else {
//                 theUser2update = { ...theUser2update, ...data4updateObj } // this line makes the put req to patch
//             }
//         }
//         theUpdatedUsers.push(theUser2update)
//     }

//     // এবার nonUpdatedUsers এ theUpdatedUsers গুলাকে push করব অথবা allMergedUsers এর ভিতরে এদের একসাথে মার্জ করব
//     const allMergedUsers = [...nonUpdatedUsers, ...theUpdatedUsers]

//     // সবশেষে database এ allMergedUsers গুলাকে সেভ করব 
//     saveUserData(allMergedUsers)
//     res.send({ success: true, msg: 'User data updated successfully' })

// })



// // Delete a user's information in the .json file using its id
// app.delete('/user/delete/:id', (req, res) => {
//     //get the id from url
//     const id = req.params.id
//     //get the existing user data
//     const existingUsers = getUserData()
//     //check if the user id exist or not
//     const findExist = existingUsers.find(user => user.id === id)
//     if (!findExist) {
//         return res.status(409).send({ error: true, msg: 'user not exist' })
//     }
//     //filter the userdata
//     const nonDeletedUser = existingUsers.filter(user => user.id !== id)
//     //finally save it
//     saveUserData(nonDeletedUser)
//     res.send({ success: true, msg: 'User data deleted successfully' })
// })



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
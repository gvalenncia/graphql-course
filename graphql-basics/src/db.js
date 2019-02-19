// Scalar types in graphql: String, Boolean, Int, float, ID

// User mock data
const users = [
    {id: '1', name: 'german', email: 'gvalencia@gmail.com'},
    {id: '2', name: 'andrew', email: 'andrew@example.com'},
    {id: '3', name: 'sara', email: 'sara@example.com'}
]

// Post mock data
const posts = [
    {id: '10', title: 'My first post', body: 'this is my first post', published: 'true', author: '1'},
    {id: '20', title: 'just another post', body: 'this is just another post body mate', published: 'true', author: '1'},
    {id: '30', title: 'have fun', body: 'remember to have fun while coding', published: 'false', author: '2'}
]

// Comment mock data
const comments = [
    {id: '1', text: 'That is fucking awesome', author: '3', post: '10'},
    {id: '2', text: 'This is amazin mate', author: '3', post: '10'},
    {id: '3', text: 'just remember tis does not work', author: '3', post: '30'},
    {id: '4', text: 'make the one first thatn the other one', author: '3', post: '30'}
]

const db = {
    users, 
    posts,
    comments
}

export { db as default }
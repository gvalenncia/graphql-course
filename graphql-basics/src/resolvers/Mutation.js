
import uuidv4 from 'uuid/v4'

const Mutation = {
    createUser(parent, args, ctx, info){
        const emailTaken = ctx.db.users.some((user) => {
            return user.email === args.data.email
        })

        if(emailTaken){
            throw new Error('The email is already taken')
        } else {

            const user = {
                id: uuidv4(),
                ...args.data
            }

            ctx.db.users.push(user)
            return user
        }
    },
    deleteUser(parent, args, ctx, info){
        const userIndex = ctx.db.users.findIndex((user)=> user.id === args.id)

        if(userIndex === -1){
            throw new Error('User not found')
        } else {
            const deletedUser = ctx.db.users.splice(userIndex, 1)
            ctx.db.posts = ctx.db.posts.filter((post) => {
                const match = post.author === args.id
                if(match){
                    ctx.db.comments = ctx.db.comments.filter((comment) => comment.post !== post.id )
                }
                return !match
            })
            ctx.db.comments = ctx.db.comments.filter((comment)=> comment.author!== args.id )

            return deletedUser[0]
        }
    },
    updateUser(parent, args, ctx, info){
        const { id, data } = args
        const user = ctx.db.users.find((user) => user.id === id)

        if(!user){
            throw new Error('User not found')
        } 

        if(typeof data.email === 'string') {
            const emailTaken = ctx.db.users.some((user) => user.email === data.email)

            if(emailTaken) {
                throw new Error('Email taken')
            }

            user.email = data.email
        }

        if(typeof data.name === 'string'){
            user.name = data.name
        }

        if(typeof data.age !== 'undefined'){
            user.age = data.age
        }

        return user
    },
    createPost(parent, args, { db, pubsub }, info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        
        if(!userExists) {
            throw new Error('User not found')
        } else {
            const post = {
                id: uuidv4(),
                ...args.data
            }

            db.posts.push(post)

            if(args.data.published === true){
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            } 

            return post
        }
    },
    deletePost(parent, args, { db, pubsub }, info){
        const postIndex = db.posts.findIndex((post)=> post.id === args.id)

        if(postIndex === -1){
            throw new Error('Post not found')
        } else {
            const deletedPosts = db.posts.splice(postIndex, 1)
            db.comments = db.comments.filter((comment) => {
                return !(comment.post === args.id)
            })

            if(deletedPosts[0].published){
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: deletedPosts[0]
                    }
                })
            }
            return deletedPosts[0]
        }
    },
    updatePost(parent, args, { db, pubsub }, info){
        const { id, data } = args
        const post = db.posts.find((post) => post.id === id)
        const originalPost = { ...post }

        if(!post){
            throw new Error('Post not found')
        } 

        if(typeof data.title === 'string') {
            post.title = data.title
        }

        if(typeof data.body === 'string'){
            post.body = data.body
        }

        if(typeof data.published === 'boolean'){
            post.published = data.published
            if(originalPost.published && !post.published){
                //deleted
                pubsub.publish('post',{
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if(!originalPoat.published && poset.published){
                //created
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if(post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, { db, pubsub }, info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post)

        if(!userExists || !postExists){
            throw new Error('The author or the post do not exist')
        } else {
            const comment = {
                id: uuidv4(),
                ...args.data
            }

            db.comments.push(comment)
            pubsub.publish(`comment ${args.data.post}`, {comment})
            return comment
        }
    },
    deleteComment(parent, args, { db, pubsub }, info){
        const commentIndex = db.comments.findIndex((comment)=> comment.id === args.id)

        if(commentIndex === -1){
            throw new Error('Commnet not found')
        } else {
            const deletedComments = db.comments.splice(commentIndex, 1)
            pubsub.publish(`comment ${deletedComments[0].post}`,{
                comment: {
                    mutation: 'DELETED',
                    data: deletedComments[0]
                }
            })
            return deletedComments[0]
        }
    },
    updateComment(parent, args, { db, pubsub }, info){
        const { id, data } = args
        const uComment = db.comments.find((comment) => comment.id === id)

        if(!uComment){
            throw new Error('Comment not found')
        } 

        if(typeof data.text === 'string') {
            uComment.text = data.text
        }

        if(typeof data.post === 'undefined'){
            uComment.post = data.post
        }

        if(typeof data.author !== 'undefined'){
            uComment.author = data.author
        }

        pubsub.publish(`comment ${uComment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: uComment
            }
        })

        return uComment
    }
}

export { Mutation as default }
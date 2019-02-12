const message = 'from my module'
const name = 'German'

const location = 'Bogota'

const getGreeting = (name) => {
    return 'welcome' + name
}

export { message, name, getGreeting, location as default }

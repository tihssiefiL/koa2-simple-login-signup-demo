const login__username = document.querySelector('#login__username')
const login__password = document.querySelector('#login__password')
const loginBtn = document.querySelector('#login')
const signup__username = document.querySelector('#signup__username')
const signup__password = document.querySelector('#signup__password')
const signup__confirm_password = document.querySelector('#signup__confirm_password')
const signupBtn = document.querySelector('#signup')
let login_title = document.querySelector('#login_title')
let signup_title = document.querySelector('#signup_title')
loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    option = {
        method: 'POST',
        url: '/login',
        data: {
            username: login__username.value,
            password: login__password.value
        },
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    axios(option)
        .then(function (response) {
            console.log(response);
            const tmpTitle = login_title.innerHTML
            login_title.innerHTML = response.data.text
            let timer = setTimeout(() => {
                login_title.innerHTML = tmpTitle
            }, 1200);
        })
        .catch(function (error) {
            const tmpTitle = login_title.innerHTML
            login_title.innerHTML = error.response.data.text
            let timer = setTimeout(() => {
                login_title.innerHTML = tmpTitle
            }, 1200);
        });
})
signupBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (signup__password.value == signup__confirm_password.value) {
        option = {
            method: 'POST',
            url: '/singup',
            data: {
                username: signup__username.value,
                password: signup__password.value,
                password_confirm: signup__confirm_password.value,
            },
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios(option)
            .then(function (response) {
                const tmpTitle = signup_title.innerHTML
                signup_title.innerHTML = response.data.text
                let timer = setTimeout(() => {
                    signup_title.innerHTML = tmpTitle
                }, 1200);
            })
            .catch(function (error) {
                const tmpTitle = signup_title.innerHTML
                signup_title.innerHTML = error.response.data.text
                let timer = setTimeout(() => {
                    signup_title.innerHTML = tmpTitle
                }, 1200);
                // console.log(error.response.status);
                // console.log(error.response.data.status); 
                // console.log(error.response.data.text);
            });
    } else {
        console.log('两次密码不一致')
        const tmpTitle = signup_title.innerHTML
        signup_title.innerHTML = '两次密码不一致'
        let timer = setTimeout(() => {
            signup_title.innerHTML = tmpTitle
        }, 1200);
        return false
    }
})
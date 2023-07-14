const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User.js')

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({min: 6})
    ],
     async (req, res) => {
    try{
        console.log('Body', req.body)
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if(candidate){
            return res.status(400).json({message: 'Такой пользователь уже существует'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User( {email, password: hashedPassword})
        await user.save()

        res.status(201).json({message: 'Пользователь создан'})


    }catch (e){
        //ответ сервера 500
        res.status(500).json({message: 'Что-то пошло не так. Попробуйте снова.'})
    }
})

// /api/auth/login
router.post(
    '/login', 
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ]
    ,
    async (req, res) => {
        try{
            console.log('Body', req.body)
            const errors = validationResult(req)
    
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }
                console.log('Валидация ошибок пройдена')
            
            const {email, password} = req.body

            const user = await User.findOne({email})

            //console.log('Процедура поиска пользователя пройдена')
            
            if(!user){
                return res.status(400).json({message:'Пользователь не найден'})
            }

            //console.log('Пользователь найден')

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch){
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
            }

            //console.log('Пароль совпадает isMatch:', isMatch)

            const jwtSecret = config.get('jwtSecret')
            //onsole.log('jwtSecret:', jwtSecret)
    
            const token = jwt.sign(
                 { userId: user.id },
                 jwtSecret,
                {expiresIn: '1h'}
            )

            //console.log('token:', token)

            res.json({token, userId: user.id})
    
        }catch (e){
            //ответ сервера 500
            res.status(500).json({message: 'Что-то пошло не так. Попробуйте снова.'})
            console.log('Непредвиденная ошибка:', e)
        }
    })

module.exports = router
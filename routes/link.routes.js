const {Router} = require('express')
const router = Router()
const config = require('config')
const Link = require('../models/Link')
const auth = require('../midleware/auth.midleware')
const shortId = require('shortid')


router.post('/generate', auth, async (req,res) => {

  try{

    //console.log('routes/link.routes.js - router.post')

    const baseUrl = config.get("baseUrl")
    //console.log('routes/link.routes.js - baseUrl', baseUrl)

    const {from} = req.body

    //console.log('routes/link.routes.js - from', from)

    const code = shortId.generate()
    const existing = await Link.findOne({from})

    //console.log('routes/link.routes.js - existing', existing)

    if (existing) {
      return res.json({link: existing})
    }

    const to = baseUrl + '/t/' + code

    console.log('routes/link.routes.js - to:', to)
    console.log('routes/link.routes.js - req.user.userId:', res.user.userId)


    const link = new Link({
      code, to, from, owner: res.user.userId
    })

    console.log('routes/link.routes.js - new link', link)


    await link.save()

    console.log('routes/link.routes.js - link save', link)


    res.status(201).json({link})

  }catch(e){
    res.status(500).json({message: 'Что-то пошло не так. Попробуйте снова.'})
  }

})

router.get('/', auth  , async (req, res) => {

  try{

    //console.log('(GET 500) link.routes.js: userID: ', res.user.userId)

    if (!res.user.userId) {
      return res.status(500).json({message: 'Некорректные данные userId.'})
    }

    const links = await Link.find({ owner: res.user.userId })
    res.json(links)

  }catch(e){
    res.status(500).json({message: 'Что-то пошло не так. Попробуйте снова.'})
    console.log('(GET 500) catch err:', e)
  }

  
})

router.get('/:id', auth, async (req, res) => {

  try{

    const link = await Link.findById(req.params.id)
    res.json(link)

  }catch(e){
    res.status(500).json({message: 'Что-то пошло не так. Попробуйте снова.'})
  }

})

module.exports = router
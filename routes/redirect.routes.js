const {Router} = require('express')
const router = Router()
const Link = require('../models/Link')

router.get('/:code', async (req, res) => {

  try{

    const link = await Link.findOne( {code: req.params.code} )
    
    if(link) {
      //подсчет кликов
      link.clicks++
      await link.save()

      //редирект на первоначальную ссылку
      res.redirect(link.from)

    }

    res.status(404).json({message: 'Ссылка не найдена'})


  }catch(e){
    res.status(500).json({message: 'Что-то пошло не так. Попробуйте снова.'})
    console.log('(GET 500) catch err:', e)
  }

  
})

module.exports = router

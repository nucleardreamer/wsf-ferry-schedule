const { app, BrowserWindow, screen } = require('electron')
const { join } = require('path')
const express = require('express')
const stylus = require('express-stylus')
const nib = require('nib')
const server = express()
const port = process.env.NODE_ENV !== 'production' ? 8080 : 80

function createWindow () {

  const { width, height } = screen.getPrimaryDisplay().workArea

  const mainWindow = new BrowserWindow({
    width,
    height,
    autoHideMenuBar: true,
    // kiosk: true,
    backgroundColor: '#ffffff',
    webPreferences: {}
  })

  mainWindow.loadURL(`http://localhost:${port}/`)

  mainWindow.webContents.openDevTools()
}

app.on('window-all-closed', () => app.quit())

// server
const public = join(__dirname, 'public')
server.use('/public', express.static(public))
// we use pug as the view engine
server.set('view engine', 'pug')
server.set('views', public)
// setup css
server.use(stylus({
  src: public,
  use: [nib()],
  import: ['nib']
}))

server.get('/', (req, res) => {
  res.render('index')
})

const wsf = require(join(__dirname, 'wsf'))

server.get('/api/routeAndSchedule/:routeId', async (req, res) => {
  let routeId = req.params.routeId
  if (!routeId) {
    return res.error('You must send a route ID')
  }
  res.json(await wsf.getRouteAndSchedule(routeId))
})

server.get('/api/scheduleToday/:routeId', async (req, res) => {
  let routeId = req.params.routeId
  if (!routeId) {
    return res.error('You must send a route ID')
  }
  res.json(await wsf.getScheduleToday(routeId))
})

server.get('/api/routes', async (req, res) => {
  res.json(await wsf.getRoutes())
})

server.get('/api/terminals', async (req, res) => {
  res.json(await wsf.getTerminals())
})

server.get('/api/terminals-and-mates', async (req, res) => {
  res.json(await wsf.getTerminalsAndMates())
})

server.get('/api/needCacheFlush', async (req, res) => {
  res.send(await wsf.needCacheFlush())
})

app.whenReady().then(() => {
  // create the server
  server.listen(port, () => {
    // load window after server is done setting up
    createWindow()
    console.log(`Server listening at: http://localhost:${port}/`)
  })
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

const { app, BrowserWindow, screen } = require('electron')
const { join } = require('path')
const express = require('express')
const server = express()
const inDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 8080

const departingID = process.env.DEPARTING_ID || 22
const arrivingID = process.env.ARRIVING_ID || 9

function createWindow () {

  const { width, height } = screen.getPrimaryDisplay().workArea

  const mainWindow = new BrowserWindow({
    width,
    height,
    autoHideMenuBar: true,
    kiosk: !inDev,
    backgroundColor: '#ffffff'
  })

  mainWindow.loadURL(`http://localhost:${port}/`)
  if (inDev) mainWindow.webContents.openDevTools()
}

app.on('window-all-closed', () => app.quit())

// server
const public = join(__dirname, 'public')
server.use('/public', express.static(public))
// we use pug as the view engine
server.set('view engine', 'pug')
server.set('views', public)

server.get('/', (req, res) => {
  res.render('index', {
    departingID, arrivingID
  })
})

const wsf = require(join(__dirname, 'wsf'))

server.get('/api/schedule/:departingID/:arrivingID', async (req, res) => {
  try {
    let schedule = await wsf.getSchedule(
      req.params.departingID,
      req.params.arrivingID
    )
    res.json(schedule)
  } catch (err) {
    res.error(err)
  }
})

server.get('/api/allRoutes', async (req, res) => {
  res.json(await wsf.getAllRoutes())
})

server.get('/api/routes/:departingID/:arrivingID', async (req, res) => {
  res.json(await wsf.getRoutes(req.params.departingID, req.params.arrivingID))
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

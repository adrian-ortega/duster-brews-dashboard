const dashboardView = (req, res) => {
    res.sendFile('index.html')
}

module.exports = {
    dashboardView
}

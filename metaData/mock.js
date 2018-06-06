function mock() {
  this.markers = [
    {
      id: 0,
      lng: 106.57813826995849,
      lat: 29.54423302919173,
      height: 30,
      weight: 30
    },
    {
      id: 1,
      lng: 106.58406058746337,
      lat: 29.55132648511911,
      height: 30,
      weight: 30
    }
  ]
}

module.exports = {
  mock: new mock()
}
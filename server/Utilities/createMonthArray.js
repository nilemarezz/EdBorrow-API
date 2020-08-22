const createMonthArray = (data) => {
  const month = []
  for (let i = 0; i < 12; i++) {
    month.push(0)
  }
  for (let i = 0; i < data.length; i++) {
    switch (data[i].month) {
      case "January":
        month[0] = data[i].Count
        break
      case "February":
        month[1] = data[i].Count
        break
      case "March":
        month[2] = data[i].Count
        break
      case "April":
        month[3] = data[i].Count
        break
      case "May":
        month[4] = data[i].Count
        break
      case " June":
        month[5] = data[i].Count
        break
      case "July":
        month[6] = data[i].Count
        break
      case "August":
        month[7] = data[i].Count
        break
      case "September":
        month[8] = data[i].Count
        break
      case "October":
        month[9] = data[i].Count
        break
      case "November":
        month[10] = data[i].Count
        break
      case "December":
        month[11] = data[i].Count
        break
    }
  }
  return month
}

module.exports = { createMonthArray }
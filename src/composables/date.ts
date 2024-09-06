export const timeDiffInfo = (past: string) => {
  const start = new Date(past)
  const endTime = Date.now()
  const subTime = endTime - start.getTime()
  const day = Math.floor(subTime / 1000 / 60 / 60 / 24)
  const hours = Math.floor(subTime / 1000 / 60 / 60)
  const minutes = Math.floor(subTime / 1000 / 60)
  const seconds = Math.floor(subTime / 1000)
  // console.log(day)
  // console.log(hours)
  // console.log(minutes)
  // console.log(seconds)
  if (day > 0) {
    return `上一次保存是${day}天前`
  } else if (hours > 0) {
    return `上一次保存是${hours}小时前`
  } else if (minutes > 0) {
    return `上一次保存是${minutes}分钟前`
  } else {
    return `上一次保存是${seconds}秒前`
  }
}

export const timePlusDays = (now: Date, days: number) => {
  now.setDate(now.getDate() + days)
  return now
}

export const getNowTime = () => {
  const yy = new Date().getFullYear()
  const MM =
    new Date().getMonth() + 1 < 10
      ? '0' + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1
  const dd =
    new Date().getDate() < 10
      ? '0' + new Date().getDate()
      : new Date().getDate()
  const HH =
    new Date().getHours() < 10
      ? '0' + new Date().getHours()
      : new Date().getHours()
  const mm =
    new Date().getMinutes() < 10
      ? '0' + new Date().getMinutes()
      : new Date().getMinutes()
  const ss =
    new Date().getSeconds() < 10
      ? '0' + new Date().getSeconds()
      : new Date().getSeconds()
  return yy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss
}

export const timeDiffInfo4Question = (past: string) => {
  const start = new Date(past)
  const endTime = Date.now()
  const subTime = endTime - start.getTime()
  const day = Math.floor(subTime / 1000 / 60 / 60 / 24)
  const hours = Math.floor(subTime / 1000 / 60 / 60)
  const minutes = Math.floor(subTime / 1000 / 60)
  // const seconds = Math.floor(subTime / 1000)
  if (day > 0) {
    return `${day}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else {
    return '刚刚'
  }
}

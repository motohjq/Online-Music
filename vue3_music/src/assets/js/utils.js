export function formatTime(interval) {
  // interval 1.234 秒 
  // 00:00 
  interval = interval | 0 //快速取整 
  // 分钟  
  const minute = ((interval / 60 | 0) + '').padStart(2, '0') //padStart(2, '0') 如果字符串长度不够 2 在当前字符之前 补全'0' 直到length为 2为止 
  // 秒数 '1' '01'   
  const second = (interval % 60 + '').padStart(2, '0')
  // '6'  '06'
  return `${minute}:${second}`

}

export function formatLyric(str) {

  let arr = str.split('[').filter(item => item !== '').reduce((prev, cur, index) => {
    // '01:30.11]却敢堵命运的枪\n' ==> ['01:30.11', '却敢堵命运的枪\n']
    let obj = {}
    let time = cur.split(']')[0] // '01:30.11'
    obj.content = cur.split(']')[1] //'却敢堵命运的枪\n'

    let second = time.split(':') // ['01','30.11']

    let secondValue = Number(second[0]) * 60 + Number(second[1])

    obj.time = secondValue
    prev.push(obj) //[{},{},{}....{}]
    return prev
  }, [])

  return arr.filter(item => item.content.trim() !== '')

}
// '01:30.11]却敢堵命运的枪\n',
//   '01:31.95]爱你和我那么像\n',
//   '01:33.83]缺口都一样\n',
//   '01:35.53]去吗？配吗？这褴褛的披风\n',
//   '00:43.20]你破旧的玩偶 你的 面具 你的自我\n',
//   '00:51.46]\n',
//   '00:51.76]他们说 要带着光 驯服每一头怪兽\n',
//  '00:58.65]他们说 要缝好你的伤 没有人爱小丑\n' i = 50     假设当前时间是 59s
//  if(59 >= 58.65 && currentLyricValue[i + 1]? 59 < currentLyricValue[i + 1].time : true){
  // index = 50
// }
/* 

[00:00.000] 作词 : 唐恬  i = 0  index = 0
[00:00.288] 作曲 : 钱雷
[00:00.576] 编曲 : 钱雷
[00:00.864] 制作人 : 钱雷

*/
/* 
[
  {
    time: 10, //秒为单位
    content: '作词 : 唐恬'
  },
  {
    time: 10, //秒为单位
    content: '作曲 : 钱雷'
  },
] */
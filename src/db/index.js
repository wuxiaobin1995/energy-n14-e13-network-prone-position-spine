/*
 * @Author      : Mr.bin
 * @Date        : 2022-10-17 15:07:44
 * @LastEditTime: 2022-10-17 15:07:46
 * @Description : Dexie
 */
import Dexie from 'dexie'

export function initDB() {
  const db = new Dexie('Energy_N14_E13_Network_Prone_Position_Spine') // 与项目名保持一致
  db.version(1).stores({
    user: 'userId,userName',
    test_data:
      '++,userId,pdfTime,testType,[userId+pdfTime],[userId+testType],[userId+testType+pdfTime]',
    train_data:
      '++,userId,pdfTime,trainType,[userId+pdfTime],[userId+trainType],[userId+trainType+pdfTime]'
  })
  return db
}

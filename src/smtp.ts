import nodemailer from 'nodemailer'
import fs from 'fs-extra'
import hbs from 'handlebars'
import path from 'path'

export type ResetTemplate = {
  tag: string
  url: string
}

const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASSWORD
  }
})

export async function compile<T>(template: string, data: T): Promise<string> {
  const templatePath = path.join(
    __dirname,
    'templates',
    `${template}.handlebars`
  )
  const templateBuffer = await fs.readFile(templatePath)
  const templateString = templateBuffer.toString('utf-8')
  const html = hbs.compile(templateString)

  return html(data)
}

export function sendMail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: 'smashpros <contact@smashpros.io>',
    to,
    subject,
    html
  })
}

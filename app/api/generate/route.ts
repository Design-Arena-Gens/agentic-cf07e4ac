import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request: Request) {
  try {
    const { prompt, tone, length } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const lengthInstructions = {
      short: '2-3 sentences',
      medium: '1 paragraph (4-6 sentences)',
      long: '2-3 paragraphs',
    }

    const systemPrompt = `You are an expert email writer. Generate professional, well-structured emails based on the user's request.
The email should have a ${tone} tone and be ${lengthInstructions[length as keyof typeof lengthInstructions]} long.
Include an appropriate subject line on the first line as "Subject: [subject]", followed by a blank line, then the email body.
Do not include placeholder text like [Your Name] or [Date] - write a complete, ready-to-send email.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: systemPrompt + '\n\nUser request: ' + prompt,
        },
      ],
    })

    const emailContent = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Unable to generate email'

    return NextResponse.json({ email: emailContent })
  } catch (error) {
    console.error('Error generating email:', error)
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    )
  }
}

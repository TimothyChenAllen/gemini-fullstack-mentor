# gemini-fullstack-mentor
Full-stack lessons I got from a Gemini Gem mentor I prompted

See [GEM.md](GEM.md) for the prompt I used. This prompt could be used in any LLM.

## Lesson 1. Get Started with React + Vite + TypeScript

**Objective**. Learn how to initialize a React.js + Vite + TypeScript app

I asked the Gem to show me how to get started with a React + Vite + TypeScript app. They
gave me this code, which creates a sample client app under an existing directory:

```bash
npm create vite@latest client-app -- --template react-ts
```

**Success**. I knew it worked when I had a working app running at http://localhost:5173/

## Lesson 2. Create the very simplest app

**Objective**. Create a simple app from scratch

Rather than use the template code, I wanted to learn how to create a working `App.tsx` file
on my own.

## Lesson 3. Preserve and use state

**Objective**. Use the hook `useState` to preserve the state of the user's favorite language
and set values in a controlled input.

## Lesson 4. Read data from an API

**Objective**. Read data from an existing API

Admittedly this is a big jump, but I started to just go with it when the stacker-mentor
proposed it. This reaches out to https://jsonplaceholder.typicode.com/todos/1 and fetches
JSON from it.

## Lesson 5. Create our own API server and connect the client

**Objective**. Create a simple server with its own API, and connect our existing
client app to read from our API server.

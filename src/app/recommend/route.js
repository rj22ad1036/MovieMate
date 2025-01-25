import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(request) {
  const { userInput } = await request.json();

  return new Promise((resolve) => {
    const process = spawn("python", ["ml_recommendation.py", userInput]);

    let output = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    process.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(NextResponse.json({ recommendation: output.trim() }));
    });
  });
}

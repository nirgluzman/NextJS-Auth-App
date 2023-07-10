import connectToDatabase from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

import { NextRequest, NextResponse } from 'next/server';

import bcryptjs from 'bcryptjs';

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    console.log('signup route - reqBody', reqBody);
    const { username, email, password } = reqBody;

    // check if user exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: 'Something went wrong', error: 'Email already exists' },
        { status: 400 }
      );
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log(hashedPassword);

    // create newUser instance and save it to db
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save(); // save user to database
    console.log(savedUser);
    return NextResponse.json(
      { message: 'User details saved in the database', success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('signup route - error', error);

    let errorMessage = 'Error!!';
    switch (error.name) {
      case 'ValidationError': // Error handling for misc validation errors
        const keys = Object.keys(error.errors);
        const values = Object.values(error.errors).map((e: any) => e.message);
        errorMessage = values.join(', ');
        console.error(`Validation Error: ${errorMessage}`);
        break;
      case 'MongoServerError': // Error handling for duplicate email address
        if (error.code === 11000) {
          errorMessage = 'Email already exists';
          console.error(`Duplicate Key Error: ${errorMessage}`);
        }
        break;
      default:
        errorMessage = error.message;
        console.error(`Unknown Error: ${errorMessage}`);
    }
    return NextResponse.json(
      { message: 'Something went wrong', error: errorMessage },
      { status: 500 }
    );
  }
}

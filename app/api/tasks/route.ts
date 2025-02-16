import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles a GET request to fetch tasks for a given user.
 *
 * Retrieves tasks associated with a specific user, optionally filtered by a tag.
 * If a `tagId` is provided in the query parameters, it fetches tasks linked
 * to that tag for the specified `userId`. If no `tagId` is provided, it fetches
 * all tasks for the specified `userId`.
 *
 * @param {NextRequest} req - The incoming request object containing URL parameters.
 *
 * @returns {NextResponse} - A JSON response containing the fetched tasks or an error message.
 *
 * @throws Will log an error and respond with a 500 status if task retrieval fails.
 * Responds with a 400 status if `userId` is not provided in the query parameters.
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const tagId = searchParams.get('tagId');

  if (!userId)
    return NextResponse.json({ error: 'UserId is required' }, { status: 400 });

  try {
    let tasks;
    if (tagId) {
      // Fetch tasks by tag
      tasks = await prisma.task.findMany({
        where: {
          userId,
          taskTags: {
            some: {
              tagId: tagId,
            },
          },
        },
        include: {
          tags: true,
        },
        orderBy: { position: 'asc' },
      });
    } else {
      // Fetch all tasks by user
      tasks = await prisma.task.findMany({
        where: { userId },
        include: {
          tags: true,
        },
      });
    }
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  //TODO: add other items in here - dueDate, tag, etc
  const { text, userId } = body;

  if (!text)
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });

  try {
    // TODO: fetch tasks by position and get the last one
    // then determine the new task's position on that
    const newTask = await prisma.task.create({
      data: {
        text,
        userId,
        // position
      },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Failed to add task:', error);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body; // Can be an array of IDs or a single ID

  if (!id)
    return NextResponse.json({ error: 'Id is required' }, { status: 400 });

  try {
    if (Array.isArray(id)) {
      await prisma.task.deleteMany({
        where: { id: { in: id } },
      });
    } else {
      await prisma.task.delete({ where: { id } });
    }

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

// TODO: this might go better in a separate route - task/route?
// export async function PATCH(req: NextRequest) {
//   const body = await req.json();
//   const { id } = body;

//   if (!id) {
//     return NextResponse.json(
//       { error: 'Task ID is required.' },
//       { status: 400 }
//     );
//   }

//   try {
//     const existingTask = await prisma.task.findUnique({ where: { id } });
//     if (!existingTask) {
//       return NextResponse.json({ error: 'Task not found' }, { status: 404 });
//     }

//     // Toggle completion status
//     const updatedTask = await prisma.task.update({
//       where: { id },
//       data: {
//         completed: !existingTask.completed,
//         dateUpdated: new Date(),
//       },
//     });

//     return NextResponse.json(updatedTask);
//   } catch (error) {
//     console.error('❌ Failed to toggle task completion:', error);
//     return NextResponse.json(
//       { error: 'Failed to toggle task completion' },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id)
    return NextResponse.json({ error: 'Id is required' }, { status: 400 });

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { ...updates },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('❌ Failed to update task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

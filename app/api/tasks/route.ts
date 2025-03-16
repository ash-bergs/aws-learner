import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Task, Tag } from '@prisma/client';

// probably don't need this interface - but we'll see how it goes
export interface PrismaTaskWithTags extends Task {
  taskTags: Array<{
    taskId: string;
    tagId: string;
    tag: Tag | null;
  }>;
}

/**
 * Handles a POST request to sync tasks for a given user.
 *
 * This function accepts a JSON payload containing `userId`, `newTasks`,
 * `updatedTasks`, and `deletedTasks`. It processes the tasks by creating
 * new tasks, updating existing tasks, and deleting specified tasks as
 * requested in the payload.
 *
 * @param {NextRequest} req - The incoming request object containing the
 * tasks data to be synced.
 *
 * @returns {NextResponse} - A JSON response indicating the result of
 * the sync operation, with a status of 200 on success, or an error
 * message with a corresponding error status if the operation fails.
 *
 * @throws Will log an error if any operation fails and respond with a
 * 500 status if task synchronization fails. Responds with a 400 status
 * if `userId` is not provided in the request.
 */
export async function POST(req: NextRequest) {
  try {
    // get the data from request
    const {
      userId,
      newTasks,
      updatedTasks,
      deletedTasks,
      // newTaskTags,
      // updatedTaskTags,
    } = await req.json();

    if (!userId)
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );

    // Strip `syncStatus` from new tasks
    // TODO: fix this more elegantly
    const sanitizedNewTasks: Task[] = newTasks.map(
      ({ syncStatus, ...task }) => task
    );

    await prisma.$transaction(async (prisma) => {
      // ✅ Insert new tasks first
      if (sanitizedNewTasks.length) {
        await prisma.task.createMany({ data: sanitizedNewTasks });
      }

      // This won't work until Tags are synced
      // ✅ Insert new task-tags
      // if (newTaskTags.length) {
      //   await prisma.taskTag.createMany({ data: newTaskTags });
      // }

      // ✅ Update existing tasks
      for (const task of updatedTasks) {
        const { syncStatus, ...sanitizedTask } = task;
        await prisma.task.update({
          where: { id: task.id },
          data: sanitizedTask,
        });
      }

      // This won't work until Tags are synced
      // ✅ Update task-tags (delete old ones and insert new ones)
      // if (updatedTaskTags.length) {
      //   const updatedTaskIds = updatedTaskTags.map((tt) => tt.taskId);
      //   await prisma.taskTag.deleteMany({
      //     where: { taskId: { in: updatedTaskIds } },
      //   });
      //   await prisma.taskTag.createMany({ data: updatedTaskTags });
      // }

      // ✅ Handle deleted tasks
      if (deletedTasks.length) {
        //   await prisma.taskTag.deleteMany({
        //     where: { taskId: { in: deletedTaskIds } },
        //   });
        const deletedTaskIds = deletedTasks.map((t) => t.id);
        await prisma.task.deleteMany({
          where: { id: { in: deletedTaskIds } },
        });
      }
    });

    return NextResponse.json(
      { message: 'Tasks synced successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sync failed: ', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}

// DEPRECATED
// We should be able to delete, build and test first
// /**
//  * Handles a GET request to fetch tasks for a given user.
//  *
//  * Retrieves tasks associated with a specific user, optionally filtered by a tag.
//  * If a `tagId` is provided in the query parameters, it fetches tasks linked
//  * to that tag for the specified `userId`. If no `tagId` is provided, it fetches
//  * all tasks for the specified `userId`.
//  *
//  * @param {NextRequest} req - The incoming request object containing URL parameters.
//  *
//  * @returns {NextResponse} - A JSON response containing the fetched tasks or an error message.
//  *
//  * @throws Will log an error and respond with a 500 status if task retrieval fails.
//  * Responds with a 400 status if `userId` is not provided in the query parameters.
//  */
// export async function GET(req: NextRequest): Promise<NextResponse> {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get('userId');

//   // TODO: make sure the types match up with Dexie

//   if (!userId) {
//     console.error('❌ ERROR: Missing userId in request');
//     return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
//   }
//   const user = await prisma.user.findUnique({ where: { id: userId } });
//   if (!user) {
//     console.error('❌ ERROR: User not found');
//     return NextResponse.json({ error: 'User not found' }, { status: 404 });
//   }

//   try {
//     console.log('🔍 Fetching all tasks for userId:', userId);
//     const tasks: PrismaTaskWithTags[] = await prisma.task.findMany({
//       where: { userId },
//       include: {
//         taskTags: {
//           include: {
//             tag: true,
//           },
//         },
//       },
//       orderBy: { position: 'asc' },
//     });

//     console.log('✅ Retrieved tasks:', tasks.length, 'tasks found');
//     console.log('📋 Tasks Data:', JSON.stringify(tasks, null, 2));

//     return NextResponse.json(tasks);
//   } catch (error) {
//     console.error('❌ Prisma Query Failed:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch tasks' },
//       { status: 500 }
//     );
//   }
// }

// // export async function POST(req: NextRequest) {
// //   const body = await req.json();
// //   const { userId, text, tagIds, taskDueDate, priority } = body;

// //   if (!text || !userId) {
// //     return NextResponse.json(
// //       { error: 'Text and UserId are required' },
// //       { status: 400 }
// //     );
// //   }

// //   try {
// //     // Find the position of the last task in the list
// //     const lastTask = await prisma.task.findFirst({
// //       where: { userId },
// //       orderBy: { position: 'desc' },
// //     });
// //     // Place the new task after the last task
// //     const newTaskPosition = lastTask?.position ? lastTask.position + 1 : 1;

// //     const newTask = await prisma.task.create({
// //       data: {
// //         text,
// //         userId,
// //         position: newTaskPosition,
// //         dueDate: taskDueDate,
// //         priority,
// //       },
// //     });

// //     // If tagIds are provided, create TaskTag associations
// //     if (tagIds && tagIds.length > 0) {
// //       await prisma.taskTag.createMany({
// //         data: tagIds.map((tagId: string) => ({
// //           taskId: newTask.id,
// //           tagId,
// //         })),
// //       });
// //     }

// //     // get the task and include the tags
// //     const taskWithTags = await prisma.task.findUnique({
// //       where: { id: newTask.id },
// //       include: {
// //         taskTags: {
// //           include: {
// //             tag: true,
// //           },
// //         },
// //       },
// //     });

// //     return NextResponse.json(taskWithTags, { status: 201 });
// //   } catch (error) {
// //     console.error('Failed to add task:', error);
// //     return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
// //   }
// // }

// export async function DELETE(req: NextRequest) {
//   const body = await req.json();
//   const { id } = body; // Can be an array of IDs or a single ID

//   if (!id)
//     return NextResponse.json({ error: 'Id is required' }, { status: 400 });

//   try {
//     if (Array.isArray(id)) {
//       // First, delete TaskTag relationships
//       await prisma.taskTag.deleteMany({
//         where: { taskId: { in: id } },
//       });

//       // Then, delete the tasks
//       await prisma.task.deleteMany({
//         where: { id: { in: id } },
//       });
//     } else {
//       // Delete TaskTag relationships
//       await prisma.taskTag.deleteMany({
//         where: { taskId: id },
//       });

//       // Delete the task
//       await prisma.task.delete({ where: { id } });
//     }

//     return NextResponse.json(
//       { message: 'Task(s) deleted successfully' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Failed to delete task:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete task' },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(req: NextRequest) {
//   const body = await req.json();
//   const { id, ...updates } = body;

//   if (!id)
//     return NextResponse.json({ error: 'Id is required' }, { status: 400 });

//   try {
//     const updatedTask = await prisma.task.update({
//       where: { id },
//       data: { ...updates },
//     });

//     return NextResponse.json(updatedTask);
//   } catch (error) {
//     console.error('❌ Failed to update task:', error);
//     return NextResponse.json(
//       { error: 'Failed to update task' },
//       { status: 500 }
//     );
//   }
// }

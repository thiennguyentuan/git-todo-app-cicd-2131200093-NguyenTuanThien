const { test, expect, _electron: electron } = require('@playwright/test');

test('End-to-end user workflow', async () => {
  const electronApp = await electron.launch({ args: ['.'] });
  const window = await electronApp.firstWindow();

  const taskText = 'My new E2E test task';

  // Task 1: Add a new todo item
  const input = window.locator('#todo-input');
  await input.fill(taskText);

  // Nếu app dùng id cho nút add, ưu tiên; nếu không thì fallback theo text
  const addBtn = window.locator('#add-button').or(window.getByRole('button', { name: /add/i }));
  await addBtn.click();

  // Task 2: Verify the todo item was added
  // Lấy item theo text để chắc chắn đúng cái vừa add
  const todoItem = window.locator('.todo-item', { hasText: taskText });
  await expect(todoItem).toBeVisible();
  await expect(todoItem).toContainText(taskText);

  // Task 3: Mark the todo item as complete
  const checkbox = todoItem.locator('input[type="checkbox"]');
  await checkbox.check();

  // Completed class
  await expect(todoItem).toHaveClass(/completed/);

  // Task 4: Delete the todo item
  const deleteBtn = todoItem.locator('.delete-btn').or(todoItem.getByRole('button', { name: /delete/i }));
  await deleteBtn.click();

  await expect(todoItem).not.toBeVisible();

  await electronApp.close();
});

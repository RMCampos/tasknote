-- Create test user
insert into users (email, password, admin, created_at, inactivated_at)
select 'test@domain.com', 'a1b2c3d4f5g6', false, current_timestamp, null
where not exists (select 1 from users where email = 'test@domain.com');

-- Create a task
insert into tasks (description, done, user_id, last_update, due_date, high_priority, tag)
select 'Install Debian', false, (select id from users where email='test@domain.com'), current_timestamp, '2025-12-12', false, 'linux'
where not exists (select 1 from tasks where description = 'Install Debian' and user_id = (select id from users where email='test@domain.com'));

-- Create a task_url
insert into task_url (task_id, url)
select (select id from tasks where description = 'Install Debian'), 'debian.org'
where not exists (select 1 from task_url where url = 'debian.org');

-- Create another task
insert into tasks (description, done, user_id, last_update, due_date, high_priority, tag)
select 'Workout', false, (select id from users where email='test@domain.com'), current_timestamp, '2025-12-12', false, 'health'
where not exists (select 1 from tasks where description = 'Workout' and user_id = (select id from users where email='test@domain.com'));

-- Create a task_url
insert into task_url (task_id, url)
select (select id from tasks where description = 'Workout'), 'healthier.com'
where not exists (select 1 from task_url where url = 'healthier.com');

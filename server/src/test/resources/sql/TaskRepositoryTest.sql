-- Create test user
insert into users (email, password, admin, created_at, inactivated_at)
select 'test@domain.com', 'a1b2c3d4f5g6', false, current_timestamp, null
where not exists (select 1 from users where email = 'test@domain.com');

-- Create some tasks
insert into tasks (description, done, user_id, last_update, due_date, high_priority, tag)
select 'Refactor', false, (select id from users where email='test@domain.com'), current_timestamp, '2025-12-12', false, 'refactoring'
where not exists (select 1 from tasks where description = 'Refactor' and user_id = (select id from users where email='test@domain.com'));

insert into tasks (description, done, user_id, last_update, due_date, high_priority, tag)
select 'Cleanup', false, (select id from users where email='test@domain.com'), current_timestamp, '2025-12-12', false, 'cleaning'
where not exists (select 1 from tasks where description = 'Cleanup' and user_id = (select id from users where email='test@domain.com'));

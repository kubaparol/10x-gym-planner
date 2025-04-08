-- Migration: Initial Schema Setup
-- Description: Creates the initial database schema for the Gym Planner application
-- Tables: user_profiles, training_plans, training_days, exercises, training_day_exercises, exercise_sets
-- Includes: Indexes, RLS policies, and all necessary constraints

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create user_profiles table
create table user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    age integer check (age >= 13 and age <= 100),
    gender varchar(20) check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
    weight numeric(5,1) check (weight > 0),
    height numeric(5,1) check (height > 0),
    experience_level varchar(20) check (experience_level in ('beginner', 'intermediate', 'advanced')),
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Create training_plans table
create table training_plans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name varchar(255) not null,
    description varchar(500),
    is_active boolean default false not null,
    created_at timestamp with time zone default now() not null,
    source varchar(20) check (source in ('manual', 'pdf_import')) default 'manual' not null
);

-- Create training_days table
create table training_days (
    id uuid primary key default gen_random_uuid(),
    plan_id uuid not null references training_plans(id) on delete cascade,
    weekday smallint not null check (weekday >= 0 and weekday <= 6),
    created_at timestamp with time zone default now() not null
);

-- Create exercises table
create table exercises (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null unique,
    created_at timestamp with time zone default now() not null
);

-- Create training_day_exercises table
create table training_day_exercises (
    id uuid primary key default gen_random_uuid(),
    day_id uuid not null references training_days(id) on delete cascade,
    exercise_id uuid not null references exercises(id),
    order_index integer not null default 0,
    sets integer not null check (sets > 0),
    repetitions integer not null check (repetitions > 0),
    rest_time_seconds integer not null check (rest_time_seconds >= 0),
    created_at timestamp with time zone default now() not null
);

-- Create exercise_sets table
create table exercise_sets (
    id uuid primary key default gen_random_uuid(),
    training_day_exercise_id uuid not null references training_day_exercises(id) on delete cascade,
    weight numeric(5,1) check (weight >= 0 and weight <= 1000),
    repetitions integer not null check (repetitions > 0),
    performed_at timestamp with time zone default now() not null,
    created_at timestamp with time zone default now() not null
);

-- Create indexes
create index idx_training_plans_user_id on training_plans(user_id);
create index idx_training_days_plan_id on training_days(plan_id);
create index idx_training_day_exercises_day_id on training_day_exercises(day_id);
create index idx_training_day_exercises_order on training_day_exercises(day_id, order_index);
create index idx_exercise_sets_training_day_exercise_id on exercise_sets(training_day_exercise_id);
create index idx_exercise_sets_performed_at on exercise_sets(performed_at);

-- Enable Row Level Security
alter table user_profiles enable row level security;
alter table training_plans enable row level security;
alter table training_days enable row level security;
alter table exercises enable row level security;
alter table training_day_exercises enable row level security;
alter table exercise_sets enable row level security;

-- Create RLS Policies for user_profiles
create policy "Users can view their own profile"
    on user_profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on user_profiles for update
    using (auth.uid() = id);

-- Create RLS Policies for training_plans
create policy "Users can view their own training plans"
    on training_plans for select
    using (auth.uid() = user_id);

create policy "Users can insert their own training plans"
    on training_plans for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own training plans"
    on training_plans for delete
    using (auth.uid() = user_id);

-- Create RLS Policies for training_days
create policy "Users can view training days from their plans"
    on training_days for select
    using (exists (
        select 1 from training_plans
        where training_plans.id = training_days.plan_id
        and training_plans.user_id = auth.uid()
    ));

create policy "Users can insert training days to their plans"
    on training_days for insert
    with check (exists (
        select 1 from training_plans
        where training_plans.id = training_days.plan_id
        and training_plans.user_id = auth.uid()
    ));

create policy "Users can delete training days from their plans"
    on training_days for delete
    using (exists (
        select 1 from training_plans
        where training_plans.id = training_days.plan_id
        and training_plans.user_id = auth.uid()
    ));

-- Create RLS Policies for exercises
create policy "All users can view exercises"
    on exercises for select
    using (true);

create policy "Only admins can insert exercises"
    on exercises for insert
    with check (auth.uid() in (select id from auth.users where role = 'admin'));

-- Create RLS Policies for training_day_exercises
create policy "Users can view exercises from their training days"
    on training_day_exercises for select
    using (exists (
        select 1 from training_days
        join training_plans on training_plans.id = training_days.plan_id
        where training_days.id = training_day_exercises.day_id
        and training_plans.user_id = auth.uid()
    ));

create policy "Users can insert exercises to their training days"
    on training_day_exercises for insert
    with check (exists (
        select 1 from training_days
        join training_plans on training_plans.id = training_days.plan_id
        where training_days.id = training_day_exercises.day_id
        and training_plans.user_id = auth.uid()
    ));

create policy "Users can delete exercises from their training days"
    on training_day_exercises for delete
    using (exists (
        select 1 from training_days
        join training_plans on training_plans.id = training_days.plan_id
        where training_days.id = training_day_exercises.day_id
        and training_plans.user_id = auth.uid()
    ));

-- Create RLS Policies for exercise_sets
create policy "Users can view sets from their exercises"
    on exercise_sets for select
    using (exists (
        select 1 from training_day_exercises
        join training_days on training_days.id = training_day_exercises.day_id
        join training_plans on training_plans.id = training_days.plan_id
        where training_day_exercises.id = exercise_sets.training_day_exercise_id
        and training_plans.user_id = auth.uid()
    ));

create policy "Users can insert sets to their exercises"
    on exercise_sets for insert
    with check (exists (
        select 1 from training_day_exercises
        join training_days on training_days.id = training_day_exercises.day_id
        join training_plans on training_plans.id = training_days.plan_id
        where training_day_exercises.id = exercise_sets.training_day_exercise_id
        and training_plans.user_id = auth.uid()
    ));

create policy "Users can delete sets from their exercises"
    on exercise_sets for delete
    using (exists (
        select 1 from training_day_exercises
        join training_days on training_days.id = training_day_exercises.day_id
        join training_plans on training_plans.id = training_days.plan_id
        where training_day_exercises.id = exercise_sets.training_day_exercise_id
        and training_plans.user_id = auth.uid()
    )); 
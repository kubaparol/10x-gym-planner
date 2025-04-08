-- Migration: Disable RLS Policies
-- Description: Disables all Row Level Security policies from the tables

-- Disable RLS for user_profiles
alter table user_profiles disable row level security;
drop policy if exists "Users can view their own profile" on user_profiles;
drop policy if exists "Users can update their own profile" on user_profiles;

-- Disable RLS for training_plans
alter table training_plans disable row level security;
drop policy if exists "Users can view their own training plans" on training_plans;
drop policy if exists "Users can insert their own training plans" on training_plans;
drop policy if exists "Users can delete their own training plans" on training_plans;

-- Disable RLS for training_days
alter table training_days disable row level security;
drop policy if exists "Users can view training days from their plans" on training_days;
drop policy if exists "Users can insert training days to their plans" on training_days;
drop policy if exists "Users can delete training days from their plans" on training_days;

-- Disable RLS for exercises
alter table exercises disable row level security;
drop policy if exists "All users can view exercises" on exercises;
drop policy if exists "Only admins can insert exercises" on exercises;

-- Disable RLS for training_day_exercises
alter table training_day_exercises disable row level security;
drop policy if exists "Users can view exercises from their training days" on training_day_exercises;
drop policy if exists "Users can insert exercises to their training days" on training_day_exercises;
drop policy if exists "Users can delete exercises from their training days" on training_day_exercises;

-- Disable RLS for exercise_sets
alter table exercise_sets disable row level security;
drop policy if exists "Users can view sets from their exercises" on exercise_sets;
drop policy if exists "Users can insert sets to their exercises" on exercise_sets;
drop policy if exists "Users can delete sets from their exercises" on exercise_sets; 
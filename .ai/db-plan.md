# Database Schema for Gym Planner

## 1. Tables

### users
- Managed by Supabase Auth
- Contains standard Supabase Auth fields

### user_profiles
- `id` UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
- `first_name` VARCHAR(100) NOT NULL
- `last_name` VARCHAR(100) NOT NULL
- `age` INTEGER CHECK (age >= 13 AND age <= 100)
- `gender` VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'))
- `weight` NUMERIC(5,1) CHECK (weight > 0)
- `height` NUMERIC(5,1) CHECK (height > 0)
- `experience_level` VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced'))
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL

### training_plans
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
- `name` VARCHAR(255) NOT NULL
- `description` VARCHAR(500)
- `is_active` BOOLEAN DEFAULT false NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
- `source` VARCHAR(20) CHECK (source IN ('manual', 'pdf_import')) DEFAULT 'manual' NOT NULL

### training_days
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `plan_id` UUID NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE
- `weekday` SMALLINT NOT NULL CHECK (weekday >= 0 AND weekday <= 6)
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL

### exercises
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `name` VARCHAR(255) NOT NULL UNIQUE
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL

### training_day_exercises
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `day_id` UUID NOT NULL REFERENCES training_days(id) ON DELETE CASCADE
- `exercise_id` UUID NOT NULL REFERENCES exercises(id)
- `order_index` INTEGER NOT NULL DEFAULT 0
- `sets` INTEGER NOT NULL CHECK (sets > 0)
- `repetitions` INTEGER NOT NULL CHECK (repetitions > 0)
- `rest_time_seconds` INTEGER NOT NULL CHECK (rest_time_seconds >= 0)
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL

### exercise_sets
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `training_day_exercise_id` UUID NOT NULL REFERENCES training_day_exercises(id) ON DELETE CASCADE
- `weight` NUMERIC(5,1) CHECK (weight >= 0 AND weight <= 1000)
- `repetitions` INTEGER NOT NULL CHECK (repetitions > 0)
- `performed_at` TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL

## 2. Relationships

- One user can have many training plans (1:N)
- One training plan can have many training days (1:N)
- One training day can have many training day exercises (1:N)
- One exercise can be used in many training day exercises (1:N)
- One training day exercise can have many exercise sets (1:N)

## 3. Indexes

- `idx_training_plans_user_id` ON training_plans(user_id)
- `idx_training_days_plan_id` ON training_days(plan_id)
- `idx_training_day_exercises_day_id` ON training_day_exercises(day_id)
- `idx_training_day_exercises_order` ON training_day_exercises(day_id, order_index)
- `idx_exercise_sets_training_day_exercise_id` ON exercise_sets(training_day_exercise_id)
- `idx_exercise_sets_performed_at` ON exercise_sets(performed_at)

## 4. Row Level Security (RLS) Policies

### user_profiles
```sql
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

### training_plans
```sql
CREATE POLICY "Users can view their own training plans"
  ON training_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own training plans"
  ON training_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own training plans"
  ON training_plans FOR DELETE
  USING (auth.uid() = user_id);
```

### training_days
```sql
CREATE POLICY "Users can view training days from their plans"
  ON training_days FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM training_plans
    WHERE training_plans.id = training_days.plan_id
    AND training_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert training days to their plans"
  ON training_days FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM training_plans
    WHERE training_plans.id = training_days.plan_id
    AND training_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete training days from their plans"
  ON training_days FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM training_plans
    WHERE training_plans.id = training_days.plan_id
    AND training_plans.user_id = auth.uid()
  ));
```

### exercises
```sql
CREATE POLICY "All users can view exercises"
  ON exercises FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert exercises"
  ON exercises FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));
```

### training_day_exercises
```sql
CREATE POLICY "Users can view exercises from their training days"
  ON training_day_exercises FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM training_days
    JOIN training_plans ON training_plans.id = training_days.plan_id
    WHERE training_days.id = training_day_exercises.day_id
    AND training_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert exercises to their training days"
  ON training_day_exercises FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM training_days
    JOIN training_plans ON training_plans.id = training_days.plan_id
    WHERE training_days.id = training_day_exercises.day_id
    AND training_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete exercises from their training days"
  ON training_day_exercises FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM training_days
    JOIN training_plans ON training_plans.id = training_days.plan_id
    WHERE training_days.id = training_day_exercises.day_id
    AND training_plans.user_id = auth.uid()
  ));
```

### exercise_sets
```sql
CREATE POLICY "Users can view sets from their exercises"
  ON exercise_sets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM training_day_exercises
    JOIN training_days ON training_days.id = training_day_exercises.day_id
    JOIN training_plans ON training_plans.id = training_days.plan_id
    WHERE training_day_exercises.id = exercise_sets.training_day_exercise_id
    AND training_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert sets to their exercises"
  ON exercise_sets FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM training_day_exercises
    JOIN training_days ON training_days.id = training_day_exercises.day_id
    JOIN training_plans ON training_plans.id = training_days.plan_id
    WHERE training_day_exercises.id = exercise_sets.training_day_exercise_id
    AND training_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete sets from their exercises"
  ON exercise_sets FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM training_day_exercises
    JOIN training_days ON training_days.id = training_day_exercises.day_id
    JOIN training_plans ON training_plans.id = training_days.plan_id
    WHERE training_day_exercises.id = exercise_sets.training_day_exercise_id
    AND training_plans.user_id = auth.uid()
  ));
```

## 5. Additional Notes

1. **Data Types**:
   - UUID is used for all primary keys to ensure uniqueness and security
   - NUMERIC(5,1) for weight and height to support values with one decimal place
   - TIMESTAMP WITH TIME ZONE for all date/time fields to ensure proper timezone handling

2. **Constraints**:
   - Appropriate CHECK constraints ensure data integrity (e.g., age between 13-100, weight > 0)
   - NOT NULL constraints on required fields
   - UNIQUE constraint on exercise names to prevent duplicates

3. **Cascading Deletes**:
   - ON DELETE CASCADE is used to maintain referential integrity when deleting parent records
   - This ensures that when a training plan is deleted, all related records are automatically removed

4. **Indexes**:
   - Indexes on foreign keys improve query performance for joins
   - Composite index on (day_id, order_index) optimizes sorting of exercises within a training day
   - Index on performed_at allows efficient querying of exercise history

5. **RLS Policies**:
   - All tables have appropriate RLS policies to ensure users can only access their own data
   - The exercises table is read-only for regular users, with insert/update/delete restricted to admins
   - Nested policies for training_day_exercises and exercise_sets ensure proper access control through the relationship chain

6. **Extensibility**:
   - The schema is designed to be extensible for future features mentioned in the PRD
   - Additional fields can be added to support features like exercise descriptions, images, or videos
   - The structure supports potential future features like workout templates or sharing plans 
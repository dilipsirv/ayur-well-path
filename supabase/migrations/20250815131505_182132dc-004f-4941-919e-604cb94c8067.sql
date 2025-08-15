-- Enable RLS on tables that are missing it
ALTER TABLE public.prakriti_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_charts ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for prakriti_results
CREATE POLICY "Users can view their own prakriti results"
ON public.prakriti_results
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prakriti results"
ON public.prakriti_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prakriti results"
ON public.prakriti_results
FOR UPDATE
USING (auth.uid() = user_id);

-- Add RLS policies for daily_schedules (these are general schedules, make them readable by authenticated users)
CREATE POLICY "Authenticated users can view daily schedules"
ON public.daily_schedules
FOR SELECT
TO authenticated
USING (true);

-- Add RLS policies for diet_charts (these are general diet charts, make them readable by authenticated users)
CREATE POLICY "Authenticated users can view diet charts"
ON public.diet_charts
FOR SELECT
TO authenticated
USING (true);
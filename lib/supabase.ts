import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://okatbfysknpgaxdfyxti.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rYXRiZnlza25wZ2F4ZGZ5eHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY1MjQ0OTIsImV4cCI6MjAxMjEwMDQ5Mn0.QnQEs6mQjFaPGwxkWROgDYzxJmGmf0X6Gsid4j5TzZQ"
);

export default supabase;

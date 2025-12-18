safe_commit() {
    local msg="$1"
    git add .
    git commit -m "$msg"
    echo "Committed: $msg"
}

safe_commit "Init Node Project With TypeScript And Express"
safe_commit "Setup MongoDB Connection And Env Variables"
safe_commit "Setup User Model With Role And Status"
safe_commit "Setup Product Model With All Fields"
safe_commit "Setup Order Model With Tracking History"
safe_commit "Setup Auth Routes With Firebase JWT"
safe_commit "Setup Users Routes With Admin Role Protection"
safe_commit "Setup Products Routes With CRUD Operations"
safe_commit "Setup Orders Routes With Create And Fetch"
safe_commit "Implement Order Approval And Rejection Logic"
safe_commit "Setup Middleware For Auth And Error Handling"
safe_commit "Setup Product Show On Home Toggle"
safe_commit "Add Tracking Update Logic For Orders"
safe_commit "Add Suspend User Reason And Feedback Logic"
safe_commit "Add Pagination And Filter Utility Functions"

echo "Server commits completed. Push with git push origin main!"
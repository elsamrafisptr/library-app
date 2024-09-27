# Library Membership App

## Entities

- Member
- Book
- Loan
- Penalty

## Use Case

- Members can borrow books with conditions
    - ✅  Members may not borrow more than 2 books
    - ✅  Borrowed books are not borrowed by other members (depend on the available stock)
    - ✅  Member is currently not being penalized
- Member returns the book with conditions
    - ✅  The returned book is a book that the member has borrowed
    - ✅  If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
- Check the book
    - ✅  Shows all existing books and quantities
    - ✅  Books that are being borrowed are not counted
    - ✅  Create new book
    - ✅  Update an existing book
    - ✅  Delete an existing book
    - ✅  Borrow Book
    - ✅  Return Book (Penalty for the member is automated when book returned overdue)
- Member check
    - ✅  Shows all existing members
    - ✅  The number of books being borrowed by each member
    - ✅  Create new member
    - ✅  Update an existing member
    - ✅  Delete an existing member

Unregistered Feature 
- Loan check
    - [ ]  Shows all existing loan history
    - [ ]  Update an existing loan
    - [ ]  Delete an existing loan
    * Not creating loan because it's automated by system
- Penalty check
    - [ ]  Shows all existing penalty history
    - [ ]  Create new penalty (direct penalty not automated by overdue system)
    - [ ]  Update an existing member
    - [ ]  Delete an existing member

For the documentation you can access to (http://yourdomain:[port]/docs)

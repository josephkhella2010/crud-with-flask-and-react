from flask import Flask, jsonify, request
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)  

books = [
    {"id": 1, "title": "book1", "author": "1"},
    {"id": 2, "title": "book2", "author": "2"},
    {"id": 3, "title": "book3", "author": "3"}
]

#  GET and POST requests for /books route
@app.route("/books", methods=["GET", "POST"])
def books_route():
    # if get method return books arr
    if request.method == "GET":
        return jsonify(books)
    # if post method return create newbook and push it inside books arr then return newbook
    if request.method == "POST":
        newBook = {
            "id": len(books) + 1,  
            "title": request.json["title"],  
            "author": request.json["author"]  
        }
        books.append(newBook)
        return jsonify(newBook), 201  

# Get request with id
@app.route("/books/<int:book_id>", methods=["GET"])
def get_book(book_id):
    for book in books:
        if book["id"] == book_id:  
            return jsonify(book)    
    return jsonify({"error": "book not found"}), 404  

# Update request a book by ID
@app.route("/books/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    for book in books:
        if book["id"] == book_id:
            book["title"] = request.json.get("title", book["title"])
            book["author"] = request.json.get("author", book["author"])

            return jsonify(book)
    
    return jsonify({"error": "book not found"}), 404
 
#delete method by id
@app.route("/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    for book in books:
        if book["id"] == book_id: 
            books.remove(book) 
            return {"data":"book sucessfully deleted"}    
    return jsonify({"error": "book not found"}), 404 


if __name__ == "__main__":
    app.run(debug=True)

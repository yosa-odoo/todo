# Simple Todo App

## To Run

```
git clone git@github.com:yosa-odoo/todo.git
mkdir todo
docker build -t todo:1.0 .
docker run -p 3000:3000 todo:1.0 
```

## Stack
- Backend: NodeJS + SQLite3
- Frontend:
  * Template engine: Hack (readFileSync + Loadash Template)
  * CSS Framework: Bootstrap
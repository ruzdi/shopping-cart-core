#!/bin/bash
echo "================= Creating mongo-init.js with user: $MONGO_ROOT_USERNAME"

cat <<EOF > mongo-init.js
db.createUser({
  user: '$MONGO_DB_ROOT_USERNAME',
  pwd: '$MONGO_DB_ROOT_PASSWORD',
  roles: [
    {
      role: 'readWrite',
      db: 'mydb',
    },
  ],
});
EOF

echo "@@@@@@@@@@@@@@@@@@@@ Finished creating mongo-init.js with user: $MONGO_ROOT_USERNAME"

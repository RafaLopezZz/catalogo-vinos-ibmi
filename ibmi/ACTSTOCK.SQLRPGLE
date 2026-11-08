**FREE
ctl-opt dftactgrp(*no) actgrp(*caller);

dcl-pi *n;
  pId    int(10);
  pCant  int(10);
end-pi;

exec sql SET OPTION COMMIT = *NONE;

exec sql
  UPDATE PRODUCTOS
     SET STOCK = STOCK + :pCant
   WHERE ID = :pId;

if sqlstate <> '00000';
  dsply ('Error SQL: ' + sqlstate);
endif;

*inlr = *on;
return;
# 防御SQL注入 Impossible版


```
&lt;?php

if( isset( $_GET[ &#39;Submit&#39; ] ) ) {
    // Check Anti-CSRF token
    checkToken( $_REQUEST[ &#39;user_token&#39; ], $_SESSION[ &#39;session_token&#39; ], &#39;index.php&#39; );

    // Get input
    $id = $_GET[ &#39;id&#39; ];

    // Was a number entered?【后端格式验证，具体分析】
    if(is_numeric( $id )) {		//【判断数字】
        $id = intval ($id);		//【获取用户输入内容的数字，再次确认】
        switch ($_DVWA[&#39;SQLI_DB&#39;]) {
            case MYSQL:
                // Check the database【SQL预处理：PDO（PHP Data Objects）：配合正确的过滤和SQL语句避免SQL注入】
                $data = $db-&gt;prepare( &#39;SELECT first_name, last_name FROM users WHERE user_id = (:id) LIMIT 1;&#39; );		//【进行SQL语句预处理】
                $data-&gt;bindParam( &#39;:id&#39;, $id, PDO::PARAM_INT );		//【绑定输入参数，并指定为整型】
                $data-&gt;execute();
                $row = $data-&gt;fetch();

                // Make sure only 1 result is returned
                if( $data-&gt;rowCount() == 1 ) {
                    // Get values
                    $first = $row[ &#39;first_name&#39; ];
                    $last  = $row[ &#39;last_name&#39; ];

                    // Feedback for end user
                    echo &#34;&lt;pre&gt;ID: {$id}&lt;br /&gt;First name: {$first}&lt;br /&gt;Surname: {$last}&lt;/pre&gt;&#34;;
                }
                break;
            case SQLITE:
                global $sqlite_db_connection;

                $stmt = $sqlite_db_connection-&gt;prepare(&#39;SELECT first_name, last_name FROM users WHERE user_id = :id LIMIT 1;&#39; );
                $stmt-&gt;bindValue(&#39;:id&#39;,$id,SQLITE3_INTEGER);
                $result = $stmt-&gt;execute();
                $result-&gt;finalize();
                if ($result !== false) {
                    // There is no way to get the number of rows returned
                    // This checks the number of columns (not rows) just
                    // as a precaution, but it won&#39;t stop someone dumping
                    // multiple rows and viewing them one at a time.

                    $num_columns = $result-&gt;numColumns();
                    if ($num_columns == 2) {
                        $row = $result-&gt;fetchArray();

                        // Get values
                        $first = $row[ &#39;first_name&#39; ];
                        $last  = $row[ &#39;last_name&#39; ];

                        // Feedback for end user
                        echo &#34;&lt;pre&gt;ID: {$id}&lt;br /&gt;First name: {$first}&lt;br /&gt;Surname: {$last}&lt;/pre&gt;&#34;;
                    }
                }

                break;
        }
    }
}

// Generate Anti-CSRF token
generateSessionToken();

?&gt; 
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2023web-%E9%98%B2%E5%BE%A1sql%E6%B3%A8%E5%85%A5-impossible%E7%89%88/  


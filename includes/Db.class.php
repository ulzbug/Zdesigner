<?php

class Db
{
	protected $conn = false;
	protected static $instance = false;
	
	private function __construct(){
		$this->connexion();
	}

    // Protect strings
    public static function pr($s)
    {
        if(self::$instance)
        {
            return self::$instance->conn->escape_string($s);
        }
        else
        {
            die('Aucune connexion active à la base de données');
        }
    }
    
    // get table name
    public static function tn($table_name)
    {
        return "`".DB_TABLE_PREFIX.$table_name."`";
    }
    
	public static function get()
	{
		if(!self::$instance)
		{
			self::$instance = new Db();
		}
		return self::$instance;
	}

	protected function connexion()
	{
		$this->conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD);
        if ($this->conn->connect_error) {
            throw new Exception('Impossible de se connecter à la base de données (' . $this->conn->connect_errno . ') ' . $this->conn->connect_error);
        }
		$this->sql_query("SET NAMES 'utf8';"); 
		$result = $this->conn->select_db(DB_DATABASE) or die('Impossible to select this database : '.DB_DATABASE);
        if(!$result)
        {
            throw new Exception('Impossible to select this database : '.DB_DATABASE);
        }
	}

	public function sql_query($requete, $msg=NULL) {

		if($msg==-1)
		{
			die($requete);
		}
		elseif($msg==-2)
		{
			echo $requete;
		}

        $result = $this->conn->query($requete);
        if(!$result)
        {
            throw new Exception('SQL Error : '.$requete.'<br />'.$this->conn->error);
        }
		
		return $result;
	}
    
    public function insert_id()
    {
        return $this->conn->insert_id;
    }
    
    public function start_transaction()
    {
        $this->sql_query("BEGIN");
    }
    
    public function commit_transaction()
    {
        $this->sql_query("COMMIT");
    }
    
    public function release_transaction()
    {
        $this->sql_query("RELEASE");
    }
}

?>
